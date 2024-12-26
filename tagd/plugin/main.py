import subprocess
import os
import argparse

# Constants
COMMENT_KEY = '-Comment'  # exiftool key for updating the Comment metadata
SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']  # Image file extensions supported

def tag_image(image_path, tag_text):
    """
    Updates the Comment metadata of an image using exiftool.

    :param image_path: Full path to the image file
    :param tag_text: Text to be added as the Comment metadata
    """
    if not os.path.isfile(image_path):
        print(f"Error: Image file not found - {image_path}")
        return False

    # Check if the file has a supported image extension
    if not any(image_path.lower().endswith(ext) for ext in SUPPORTED_EXTENSIONS):
        print(f"Warning: Unsupported file type for {image_path}. Skipping...")
        return False

    # Construct the exiftool command
    command = ['exiftool', COMMENT_KEY, f'"{tag_text}"', image_path]

    try:
        # Execute the exiftool command
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"Successfully tagged {image_path} with: {tag_text}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error tagging {image_path}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Tag images by updating the Comment metadata using exiftool.')
    parser.add_argument('image_path', help='Path to the image file')
    parser.add_argument('tag_text', help='Text to be added as the Comment metadata')
    args = parser.parse_args()

    tag_image(args.image_path, args.tag_text)

if __name__ == '__main__':
    main()