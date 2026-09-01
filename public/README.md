# public/

## logo.png — needed

Save the LP seal artwork here, named exactly `logo.png`.

It appears in the site header, the mobile drawer, the footer, the builder's top
bar, the 404 page and the comparison table. Until the file exists, all of those
show a placeholder mark instead — the header never breaks, but it is not your
logo.

- **Format**: PNG with a transparent background if you have one. The seal is
  circular, and the site clips it to a circle, so a white square background
  will show as a white disc behind it.
- **Size**: 512×512 or larger, square. It is displayed at 36px in the header,
  so anything smaller will look soft on a retina screen.

### The favicon is separate

`src/app/favicon.ico` is still the old one. Replace it with a 32×32 ICO cut
from the same artwork — at that size only the "LP" is going to be legible, so
crop to those two letters rather than shrinking the whole seal.
