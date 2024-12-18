from PIL import Image, ImageOps
import os

def resize_and_pad_images(input_folder, output_folder, target_size=(800, 600), background_color=(255, 255, 255)):
    """
    Resize images and place them on a plain background of the specified size.

    Parameters:
        input_folder (str): Path to the folder containing input images.
        output_folder (str): Path to the folder to save output images.
        target_size (tuple): Target size (width, height) for the output images.
        background_color (tuple): Background color as an RGB tuple.
    """
    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)

            # Open the image
            with Image.open(input_path) as img:
                # Resize image to fit within the target size while maintaining aspect ratio
                img.thumbnail((target_size[0], target_size[1]))

                # Create a new image with the target size and background color
                background = Image.new('RGB', target_size, background_color)

                # Calculate position to center the image on the background
                x_offset = (target_size[0] - img.width) // 2
                y_offset = (target_size[1] - img.height) // 2

                # Paste the resized image onto the background
                background.paste(img, (x_offset, y_offset))

                # Save the output image
                background.save(output_path)

    print(f"Processed images are saved in: {output_folder}")

# Example usage
input_folder = "images" # Replace with the path to your input folder
output_folder = "resized"  # Replace with the path to your output folder
resize_and_pad_images(input_folder, output_folder)
