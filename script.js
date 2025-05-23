const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const videoInput = document.getElementById('videoInput');
const imageInput = document.getElementById('imageInput');
const audioInput = document.getElementById('audioInput');
const mediaPreview = document.getElementById('mediaPreview');
const exportBtn = document.getElementById('exportBtn');
const startEditBtn = document.getElementById('startEditBtn');
const exportStatus = document.getElementById('exportStatus');
const outputVideo = document.getElementById('outputVideo');

let sourceVideos = [];
let sourceImages = [];
let sourceAudios = [];

function previewFiles(files, type) {
  Array.from(files).forEach(file => {
    let elem;
    if (type === 'video') {
      elem = document.createElement('video');
      elem.controls = true;
    } else if (type === 'image') {
      elem = document.createElement('img');
    } else if (type === 'audio') {
      elem = document.createElement('audio');
      elem.controls = true;
    }
    elem.src = URL.createObjectURL(file);
    mediaPreview.appendChild(elem);
  });
}

videoInput.addEventListener('change', e => {
  sourceVideos = Array.from(e.target.files);
  previewFiles(sourceVideos, 'video');
});
imageInput.addEventListener('change', e => {
  sourceImages = Array.from(e.target.files);
  previewFiles(sourceImages, 'image');
});
audioInput.addEventListener('change', e => {
  sourceAudios = Array.from(e.target.files);
  previewFiles(sourceAudios, 'audio');
});

startEditBtn.addEventListener('click', () => {
  if (sourceVideos.length === 0 && sourceImages.length === 0) {
    alert('Please add at least one video or image source!');
    return;
  }
  exportBtn.disabled = false;
  exportStatus.textContent = 'Ready to export!';
});

exportBtn.addEventListener('click', async () => {
  exportBtn.disabled = true;
  exportStatus.textContent = 'Loading ffmpeg-core.js (first load may take up to 1 minute)...';
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  exportStatus.textContent = 'Processing sources...';

  // Load videos, images, audios into ffmpeg FS
  let fileIndex = 0;
  let concatList = [];
  for (let file of sourceVideos) {
    const name = `video${fileIndex}.mp4`;
    ffmpeg.FS('writeFile', name, await fetchFile(file));
    concatList.push(name);
    fileIndex++;
  }
  for (let file of sourceImages) {
    const name = `image${fileIndex}.png`;
    ffmpeg.FS('writeFile', name, await fetchFile(file));
    // Convert image to video (5s duration)
    await ffmpeg.run(
      '-loop', '1',
      '-i', name,
      '-t', '5',
      '-vf', 'scale=1280:720,format=yuv420p',
      `imgvid${fileIndex}.mp4`
    );
    concatList.push(`imgvid${fileIndex}.mp4`);
    fileIndex++;
  }
  // Create concat.txt for ffmpeg
  const concatText = concatList.map(n => `file '${n}'`).join('\n');
  ffmpeg.FS('writeFile', 'concat.txt', concatText);

  // Concatenate videos/images
  exportStatus.textContent = 'Concatenating videos/images...';
  await ffmpeg.run(
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat.txt',
    '-c', 'copy',
    'output.mp4'
  );

  // If audio, merge into final video
  if (sourceAudios.length > 0) {
    let audioIndex = 0;
    let audioInputs = [];
    for (let file of sourceAudios) {
      const name = `audio${audioIndex}.mp3`;
      ffmpeg.FS('writeFile', name, await fetchFile(file));
      audioInputs.push(`-i`, name);
      audioIndex++;
    }
    exportStatus.textContent = 'Mixing audio...';
    // Merge all audio tracks
    await ffmpeg.run(
      ...audioInputs,
      '-filter_complex',
      `[0:a][1:a]amerge=inputs=${audioInputs.length / 2}[aout]`,
      '-map', '0:v',
      '-map', '[aout]',
      '-c:v', 'copy',
      '-ac', '2',
      '-shortest',
      'remix.mp4'
    );
    // Final output
    var data = ffmpeg.FS('readFile', 'remix.mp4');
  } else {
    // No audio, just output.mp4
    var data = ffmpeg.FS('readFile', 'output.mp4');
  }

  // Create download link and preview
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  outputVideo.src = URL.createObjectURL(videoBlob);
  outputVideo.style.display = 'block';
  exportStatus.innerHTML = `Export complete! <a href="${outputVideo.src}" download="remix.mp4">Download Remix Video</a>`;
  exportBtn.disabled = false;
});