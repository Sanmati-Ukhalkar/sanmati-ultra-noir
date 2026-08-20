import os
import imageio
from PIL import Image

video_path = r'c:\Projects\SanmatiPortfolio\developer_hero_video.mp4'
output_dir = r'c:\Projects\SanmatiPortfolio\public\assets\hero-sequence'

if not os.path.exists(output_dir):
    os.makedirs(output_dir, exist_ok=True)

print(f"Opening video {video_path}...")
reader = imageio.get_reader(video_path, format='ffmpeg')
meta = reader.get_meta_data()
fps = meta.get('fps', 30)
duration = meta.get('duration', 0)
print(f"Video metadata: FPS={fps}, Duration={duration}s")

# Extract 120 total frames evenly sampled across the video length
target_frames = 120
all_frames = []

for i, frame in enumerate(reader):
    all_frames.append(frame)

total_extracted = len(all_frames)
print(f"Total raw frames extracted: {total_extracted}")

if total_extracted > 0:
    indices = [int(i * (total_extracted - 1) / (target_frames - 1)) for i in range(target_frames)]
    
    print(f"Saving {target_frames} sampled WebP frames to {output_dir}...")
    for idx_out, frame_idx in enumerate(indices):
        frame_data = all_frames[frame_idx]
        img = Image.fromarray(frame_data)
        
        # Resize to 1280x720 WebP for optimal balance between high resolution and crisp performance
        img_resized = img.resize((1280, 720), Image.Resampling.LANCZOS)
        
        out_filename = f"frame_{idx_out:03d}.webp"
        out_path = os.path.join(output_dir, out_filename)
        img_resized.save(out_path, 'WEBP', quality=85)

    print(f"Successfully saved {target_frames} frames to {output_dir}!")
else:
    print("Error: No frames extracted from video.")
