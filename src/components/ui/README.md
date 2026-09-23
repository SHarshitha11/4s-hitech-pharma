# UI Design System



## Overview



The 4S HITECH PHARMA application uses reusable UI components for consistent layouts, spacing, typography, colors, and common interface elements.



## Components



- Button - Primary, secondary, danger, and outline variants.

- Input - Labels, placeholders, validation errors, and disabled state.

- Card - Reusable container with optional title and description.

- Badge - Status indicators for different states.

- Table - Responsive typed data table.

- Modal - Accessible dialog component.

- Alert - Informational and status messages.



## Design Tokens



Design tokens are defined in design-tokens.ts.



They cover spacing, typography, and border radius.



## Colors



The default neutral professional palette is defined in colors.ts.



It includes background, foreground, muted text, borders, primary, secondary, success, warning, danger, and information colors.



## Usage



Shared components are exported through:



src/components/ui/index.ts



Example:



import { Button, Card, Badge } from "@/components/ui";



## Responsive Testing



The /products page was manually tested at:



- 390 x 844

- 768 x 1024

- 1440 x 900



No visible horizontal overflow or layout overlap was observed during testing.



## Example Pages



The design system is demonstrated on:



- /products

- /pharmacy/products

