# Restaurant Table Images

This directory contains AI-generated table images for the restaurant floor plan modal.

## Generated Images (Bria AI)

These images were generated using Bria AI to ensure consistency across all table capacities:

- **table-2-seats.png** - 2-person dining table (small round table)
- **table-4-seats.png** - 4-person dining table (square table)
- **table-6-seats.png** - 6-person dining table (rectangular table)
- **table-8-seats.png** - 8-person dining table (large rectangular table)

### Image Specifications

- **Style**: Professional overhead view with white tablecloth
- **Elements**: Wine glasses, plates, and cutlery
- **Aesthetic**: Modern minimalist with soft lighting
- **Format**: PNG, 1:1 aspect ratio
- **Quality**: High-resolution, commercially safe

### Generation Details

All images were generated with the same base prompt to ensure visual consistency:

```
Professional overhead view of elegant restaurant dining table with white tablecloth,
wine glasses, plates, and cutlery, modern minimalist style, soft lighting,
high quality photography, centered composition
```

Each capacity variation includes specific table size descriptors:

- 2 seats: "small round table"
- 4 seats: "square table"
- 6 seats: "rectangular table"
- 8 seats: "large rectangular table"

### Usage

The TableDetailModal component automatically selects the appropriate image based on the table's seating capacity:

```tsx
const getTableImage = (capacity: number): string => {
  return `/tables/table-${capacity}-seats.png`;
};
```

### Regeneration

To regenerate these images, run:

```powershell
.\generate-table-images.ps1
```

This will create new images using Bria AI and save them to this directory.

## Legacy Images

The other Table\*.png files are from the original Java Swing application and are kept for reference.
