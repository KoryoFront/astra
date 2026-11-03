// A CSS 3D phone: front and back renders plus four metal sides, so it has real thickness when it turns.
export function phone3d({ front, back, frame = '#5b5d63', id = '', alt = 'ASTRA phone', size = '' }) {
  return `<div class="p3d-wrap"><div class="p3d" ${id ? `id="${id}"` : ''} style="--frame:${frame};${size}">
    <div class="p3d-face p3d-front"><img src="${front}" alt="${alt} front"></div>
    <div class="p3d-face p3d-back"><img src="${back}" alt="${alt} back"></div>
    <i class="p3d-side p3d-l"></i><i class="p3d-side p3d-r"></i><i class="p3d-side p3d-t"></i><i class="p3d-side p3d-b"></i>
    <div class="p3d-shadow"></div>
  </div></div>`;
}
