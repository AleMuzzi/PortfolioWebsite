# Lithophane Lamp

## Summary
Personalized 3D-printed lamps that reveal high-detail photographs when illuminated.

## What this project is
This project showcases a series of custom-designed **lithophane lamps** created as personalized functional art. A lithophane is an etched or molded artwork in very thin translucent porcelain or plastic that can only be seen clearly when back lit with a light source. In this project, 3D printing is used to create these pieces, where varying thicknesses in the plastic translate into different levels of light transmission, revealing a detailed photograph.

The project includes several unique designs, each tailored for a specific recipient, along with a reusable framework for creating new designs from any photograph.

## How it works

### Image Processing and Depth Mapping
The transformation of a 2D photograph into a 3D-printable shell involves a careful digital workflow:

1. **Photographic Preparation:** High-contrast images are selected and processed (using tools like GIMP) to optimize them for light transmission.
2. **Negative Conversion:** The image is inverted so that dark areas correspond to thicker sections of the print and light areas to thinner sections, ensuring a natural-looking photograph when illuminated.
3. **Displacement Mapping:** The processed grayscale image is used as a "displacement map" in 3D modeling software. This map dictates the local thickness of a 3D surface (typically a sphere or cylinder), effectively "carving" the image into the digital geometry.

### 3D Modeling and Structural Design
Creating a functional lamp requires more than just the image; it needs structural integrity and a way to house the light source:

- **Surface Geometry:** The lithophane effect is applied to a base spherical or cylindrical model using advanced modifiers in 3ds Max or Blender.
- **Structural Sectioning:** To facilitate printing without excessive support material, large models are often split into manageable sections using boolean operations. This allows for cleaner internal surfaces and easier assembly.
- **Fitting & Tolerances:** The models are designed to fit together precisely, often including a dedicated base to house electronics and the light source.

### Production Pipeline
The final physical objects are produced via FDM (Fused Deposition Modeling) 3D printing:

1. **High-Resolution Slicing:** The 3D models are sliced with very thin layers (0.1mm - 0.2mm) to ensure smooth gradients and fine photographic detail.
2. **Material Selection:** Translucent white PLA or similar light-colored filaments are used for their excellent light-diffusion properties.
3. **Assembly:** The printed shells are mounted onto a base containing an LED light source, resulting in a unique piece of personalized home decor.

## Technologies and tools
- **Image Editing:** GIMP for photographic optimization and depth map preparation.
- **3D Modeling:** 3ds Max and Blender for displacement mapping, boolean geometry, and structural design.
- **3D Printing:** FDM printing with translucent materials and high-detail slicing configurations.
- **Light Integration:** Design of custom bases for LED-based illumination.
