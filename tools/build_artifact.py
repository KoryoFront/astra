"""Build a Claude-artifact release: copies css/ and js/ into a versioned folder (r-<git hash>/)
so browsers never reuse cached modules from an older release, and writes the entry page."""
import json, os, shutil, subprocess, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'dist-artifact')
ver = 'r-' + subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=root, text=True).strip()
if subprocess.check_output(['git', 'status', '--porcelain'], cwd=root, text=True).strip():
    ver += '-wip'
shutil.rmtree(out, ignore_errors=True)
for d in ('css', 'js'):
    shutil.copytree(os.path.join(root, d), os.path.join(out, ver, d))
page = open(os.path.join(root, 'artifact.html')).read()
page = page.replace('href="css/styles.css"', f'href="{ver}/css/styles.css"').replace('src="js/app.js"', f'src="{ver}/js/app.js"')
open(os.path.join(out, 'artifact.html'), 'w').write(page)
files = {}
for base in (ver,):
    for r, _, fs in os.walk(os.path.join(out, base)):
        for f in fs:
            p = os.path.relpath(os.path.join(r, f), out); files[p] = os.path.join(out, p)
for r, _, fs in os.walk(os.path.join(root, 'assets')):
    for f in fs:
        p = os.path.relpath(os.path.join(r, f), root); files[p] = os.path.join(root, p)
json.dump(files, open(os.path.join(out, 'files.json'), 'w'), indent=0)
print(ver, len(files), 'files')
