# 💡 Lithophane Lamp

## Summary

A 3D-printed lamp that reveals a high-detail photograph when illuminated

## What this project is

This project began as a Valentine's Day gift when the theme was "homemade". It was so well-received that I was later commissioned to create several more.

A lithophane is a work of art etched or molded into very thin porcelain or translucent plastic that can only be clearly seen when backlit by a light source. In this project, 3D printing is used to create these pieces, where varying thicknesses in the plastic translate into different levels of light transmission, revealing a detailed photograph.

### Image Processing and Depth Mapping

Transforming a 2D photograph into a 3D-printable shell involves a careful digital workflow:

1. **Photo Preparation:** High-contrast images are selected and processed (using tools like GIMP) to optimize them for light transmission.
2. **Negative Conversion:** The image is inverted so that dark areas correspond to the thickest sections of the print and light areas to the thinnest, ensuring a natural-looking photograph when lit.
3. **Displacement Mapping:** The processed grayscale image is used as a "displacement map" in 3D modeling software. This map dictates the local thickness of a 3D surface (typically a sphere or cylinder), effectively "sculpting" the image into the digital geometry.

### Production Pipeline

In this case, the lamps are produced via FDM (Fused Deposition Modeling) 3D printing:

1. **High-Resolution Slicing:** 3D models are sliced with very thin layers (0.1 mm) to ensure smooth gradients and fine photographic detail.
2. **Material Selection:** Filaments such as translucent white PLA or similar light colors are used for their excellent light diffusion properties.
3. **Assembly:** The printed shells are mounted on a base containing an LED light source to avoid overheating the plastic and risking melting, resulting in a unique piece of personalized decor.

<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

![litofania_immagine_originale.png{width="700px"}{align="center"}{caption="Original image"}](assets/litofania_immagine_originale.png) 

![litofania_modello.jpg{width="300px"}](assets/litofania_modello.jpg)
![litofania_modello_sezione.jpg{width="300px"}](assets/litofania_modello_sezione.jpg)
![litofania_interruttore.jpg{width="300px"}](assets/litofania_interruttore.jpg)
</div>
<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

![litofania_fine_stampa.jpg{width="500px"}{align="left"}](assets/litofania_fine_stampa.jpg)
<video src="assets/litofania_stampa.mp4" loop autoplay muted playsinline width="500"></video>
</div>

### Results

The final result is a lamp that, when turned off, appears as a simple white object, but when turned on, reveals a detailed and captivating photograph.

<div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">

![litofania_fine.jpg{width="500px"}](assets/litofania_fine.jpg)
<video src="assets/litofania_fine.mp4" loop autoplay muted playsinline width="500"></video>

</div>

## Technologies and tools

* **Image Editing:** GIMP
* **3D Modeling:** 3ds Max, Blender
* **3D Printing:** FDM 3D print, Ender 3 Pro, Cura Slicing Software
