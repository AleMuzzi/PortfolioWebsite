# 🖨️ Gargantua - Large Format 3D Printer

## Summary

An open-source large format DIY 3D printer based on BTT Manta M8P and Klipper

## What this project is

It all started with a simple mistake: I ordered the wrong glass bed for my Creality Ender 3 Pro, receiving a 420x420 mm plate instead of the 220x220 mm version. Rather than returning or cutting it, I decided to build a brand-new 3D printer capable of fully utilizing this massive printing surface.

My Ender 3 Pro had already undergone several modifications—dual Z-axis, E3D V6 all-metal hotend, BLTouch auto-leveling, and more. However, I wanted to explore this world more deeply by building a machine from scratch with custom firmware that would allow me to experiment with new 3D printing approaches. I used the CAD design provided by Creality for the Ender 3[<math display="inline"><sup>↗</sup></math>](https://github.com/Creality3DPrinting/Ender-3) as a starting point and completely overhauled it for a much larger format.

Since this was my first time designing a 3D printer and I was still learning the ropes, I stayed conservative by keeping the basic architecture: a V-slot aluminum structure and a dual Z-axis.

> 💡 **Hindsight is 20/20:** If I were to start over today, I would almost certainly opt for a CoreXY configuration. It offers significant advantages in speed and precision, especially for larger formats, and I would move toward a linear rail system instead of V-slots.

---

### Dettagli tecnici
```
Build Volume:           400x400x768 mm                   
Dimesions:                                        Extruders number:              2                   
    printer:            620x625x1145mm            Max extruders temperature:  300°      
    with case:         1020x890x1350mm            Max bed temperature:        110°         
    + dehumidifier:    1020x890x1790mm            Enclosure:                    Sì                          
Precision:                      0.1 mm            OS:                      Klipper                              
Max speed:                    300 mm/s            Power:               2x 24V 500W               
```

### Hardware

Choosing the firmware was the first major decision, as it influenced all subsequent hardware choices. **Klipper** emerged as the winner due to its flexibility and ability to leverage 32-bit hardware for precise movement and temperature control.

![gargantua_btt_manta_m8p_photo.png{width="400px"}{align="right"}{caption="BTT Manta M8P"}](assets/gargantua_btt_manta_m8p_photo.png)

For the controller, I chose the **BTT Manta M8P** board—a 32-bit control board based on the ARM Cortex-M0+. 
It is paired with the **BTT CB1** computing module (essentially a twin to the Raspberry Pi CM4), which runs Klipper and manages the **Mainsail**[<math display="inline"><sup>↗</sup></math>](https://github.com/mainsail-crew/mainsail) user interface.

To reuse as many components as possible from my Ender 3 Pro, I kept the reliable **NEMA 17** stepper motors, supplementing them with a dual-shaft **CR 42-60** motor for the Y-axis, inspired by the Creality CR-6 Max configuration.
Also from the Creality CR-6 Max I took the heated bed, which offers a large printing surface of **400x400mm** and uniform heat distribution, and the idea of adding a couple of diagonal tie rods to improve the stability of the structure.

The motors are driven by **TMC2209** drivers, known for their silent operation and advanced microstepping. 

Because of the high power draw of the massive bed and dual hotends, I calculated the following power requirements:

![gargantua_biqu_extruder.png{width="300px"}{align="right"}{caption="Biqu H2 V2S REVO"}](assets/gargantua_biqu_extruder.png)

-**Heated Bed:** 420W @ 24V
-**2x Biqu H2 V2S REVO Hotends (up to 300°):** 40W each
-**Filament Drying System:** 200W
- **Other components**: motors, fans, electronics
- **Safety margin**

I opted for **two 24V 500W power supplies**—one dedicated solely to the bed and the other for all other components. The bed is controlled via a **Solid State Relay (SSR)** for safety and reliability.

Finally, I upgraded the bed leveling sensor from a standard probe to a **Beacon H**[<math display="inline"><sup>↗</sup></math>](https://beacon3d.com/), which uses eddy current displacement to measure distance. This allowed the bed mesh to leap from a 5x5 grid to a highly accurate 30x30 matrix without needing interpolation.

<div style="display: flex; flex-direction: column; align-items: left; gap: 20px">

![gargantua_bed_mesh.png{width="400px"}{align="right"}{caption="The plate seems very tilted, but if you look carefully at the Z-axis, on 40cm of length there is only 2mm of maximum difference"}](assets/gargantua_bed_mesh.png)
<video src="assets/gargantua_bed_scan.mp4" loop muted autoplay playsinline width="400"></video>

</div>

---

### Design and Development

The printer design was done using **Fusion 360**, which allowed me to precisely design each component, simulate axis movement, and verify the integration of all hardware components. I created detailed 3D models for every part of the printer, including motor mounts, heated dish brackets, electronics mounts, and cooling components.
The development process was iterative, with frequent testing and design changes. Designing everything in CAD allowed me to identify and resolve potential compatibility and space issues before proceeding to the assembly phase, saving time and resources.
The project was initially manageable in size, but over time it was necessary to break it down into parts and combine them into a single design for when an overall view is needed. This modularity allowed for more agile development of the various components.

![gargantua_printer.gif{width="400px"}{align="center"}{caption="Gargantua's structure"}](assets/gargantua_printer.gif)

#### From Bowden to Direct Drive

The Creality Ender 3 Pro uses a "bowden" extrusion system, in which the extruder is separated from the hotend and the filament is pushed through a tube to the hotend.
This approach has some advantages, such as reducing weight on the X-axis, but can present problems of reactivity and precision in extrusion, especially with flexible materials. I had already had difficulty with this system when trying to print TPU, which tended to bend inside the bowden tube, so I decided to switch to a "direct drive" system, where the extruder is mounted directly on the hotend. This change significantly improved the precision and responsiveness of the extrusion, allowing me to print a wider range of materials with greater reliability.
In designing this printer, flexibility took priority over performance; if I were to start over with a CoreXY system, I would probably opt for a bowden extrusion system, to reduce the weight on the X-axis and improve printing speed, at the cost of not being able to print flexible materials.

#### Dual Extruder

The idea of being able to print with two extruders has always fascinated me: in addition to allowing printing in 2 colors, it allows you to experiment with different materials, such as prints in which a flexible and a non-flexible material are interleaved, or to use soluble media such as PVA.
I then decided to implement it from the beginning, designing a support head for two Biqu H2 V2S REVO hotends.

![gargantua_print_head_bowden.png{width="900px"}{align="center"}](assets/gargantua_print_head_bowden.png)
![gargantua_print_head_direct_drive.png{width="900px"}{align="center"}{caption="(sopra) Bowden extruder, (sotto) Direct drive extruder"}](assets/gargantua_print_head_direct_drive.png)

In the images above you can see the difference between the print head with bowden extruders and the one with direct drive extruders.
In the first, you can glimpse the extruders and the aeration channels to cool them (hidden fans to show the details), and in the distance on the left, the extruder motors.
In the second, however, you can see the two extruder motors mounted directly on the hotends on the print head. The metal profile where the motors for the bowden system were housed was left mounted to have an anchor for the cables going to the head.

In addition to the extruders, it can be noted that the aeration channels of the workpiece, fed by two radial fans, have also been improved, to allow for more homogeneous cooling.

#### Enclosure
To improve print quality, reduce noise during printing, and issues related to warping parts when printing materials like ABS, I decided to build a printer enclosure, a structure that completely encloses the printer, maintaining a stable internal temperature and reducing the influence of external air currents.
I already had experience building enclosures, for my Ender 3 Pro I had built what on the internet is called "IKEA Lack Enclosure"[<math display="inline"><sup>↗</sup></math>](https://www.google.com/search?q=ikea+lack+enclosure): using two overlapping IKEA Lack coffee tables, plexiglass panels for the side walls and doors, and 3D printing the various connectors.
As a first enclosure it might have been fine, but the IKEA Lack coffee table did not provide the necessary stability, and in any case it would not have been a solution applicable to a large printer like Gargantua.

For Gargantua, I drew a hollow aluminum square-section profile structure, with two ports, so that I had both front and side access to the printer.

![gargantua_enclosure.png{width="900px"}{align="center"}{caption="Gargantua nel suo case"}](assets/gargantua_enclosure.png)

The walls and doors were then padded with insulation panels and covered with hard plastic panels.
To allow me to inspect the printing in progress without having to open the doors, I designed the doors with a double hinge, so that the outer part can be opened independently of the inner part, consisting of an aluminum frame with a transparent plexiglass panel.
Inside, the printer is attached to the enclosure through 4 rubber dampers, to reduce vibrations transmitted to the structure, which is also equipped with rubber dampers such as feet.

>ℹ️ The enclosure is necessarily non-square in base, this is to minimize the size, but leaving room for the plate to slide along the Y-axis.

A strip led system was installed on the ceiling of the enclosure, to illuminate the interior during printing and facilitate visual inspection of the printing process.

TODO FINISH
---

### Filament Dehumidifier

Filaments are hygroscopic and can degrade print quality by absorbing moisture. I integrated a dedicated drying compartment above the enclosure that holds 10 spools, keeping them dry and feeding them directly into the extruders.

### Fume Management

Printing materials like ABS generates harmful fumes. Lacking an external vent, I integrated the **AlveoOne R by Alveo3D**[<math display="inline"><sup>↗</sup></math>](https://www.alveo3d.com/en/product/alveoone-r-assembled/), which uses HEPA and activated carbon filters to purify the air inside the case.

### The Name: Gargantua

The name was chosen in honor of the supermassive black hole in Christopher Nolan's *Interstellar*. It symbolizes the sheer size and power of the printer and its build volume of **400x400x768 mm**.

---

### Lessons Learned

This project came with its fair share of challenges:

1. **Thermal Management:** I underestimated the internal heat of the insulated enclosure. At 50°C, the electronics began to fail. I eventually moved all power supplies and control boards to the outside of the case for better dissipation.
2. **Nozzle Alignment:** Maintaining a perfectly level height (~0.1mm tolerance) between dual extruders proved difficult due to nozzle wear and manufacturing variances. I am currently researching IDEX (Independent Dual Extrusion) as a more robust solution.

---

### Open Source

This project is fully open source. All design files, firmware, and documentation are available on GitHub[<math display="inline"><sup>↗</sup></math>](https://github.com/AleMuzzi/Gargantua) to inspire the maker community.

## Technologies and tools

* **Firmware:** Klipper
* **Hardware:** BTT Manta M8P, BTT CB1, NEMA 17, CR 42-60, TMC2209, SSR
* **User Interface:** Mainsail
* **Slicers:** Cura, PrusaSlicer
* **Design:** Fusion 360

---

Would you like me to help you draft the technical specifications for the proposed IDEX upgrade for this printer?