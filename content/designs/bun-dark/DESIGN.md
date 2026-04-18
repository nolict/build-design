# Bun Design System
=====================================

## 1. Visual Theme & Atmosphere

Bun's visual brand voice is a masterclass in striking a balance between Emotional Gravity and Optical Restraint. The design exudes a sense of sophistication and modernity, while also being approachable and inviting. The use of a predominantly dark color scheme, punctuated by strategically placed accents of bright color, creates a sense of drama and tension that draws the user in.

At the same time, the design is careful not to overwhelm the user with too much visual information. The Whitespace Philosophy is a core structural element of the design, providing a clear hierarchy of information and guiding the user's eye through the layout. This thoughtful use of whitespace creates a sense of breathing room, allowing the user to focus on the content and navigate the interface with ease.

One of the standout features of Bun's design is its use of typography. The system-ui font family provides a clean and modern aesthetic, while the carefully considered typography rules ensure that the text is always legible and easy to read. The use of headings and subheadings creates a clear hierarchy of information, making it easy for the user to scan the content and understand the structure of the page.

The design also makes use of a range of visual elements, including icons, images, and graphics, to add visual interest and break up the text. These elements are carefully integrated into the design, using a consistent visual language that reinforces the brand's identity.

Overall, Bun's visual theme and atmosphere are a key part of its appeal, providing a unique and engaging user experience that sets it apart from other JavaScript runtimes.

## 2. Color Palette & Roles

### Primary

| Name | Hex | Intent |
| --- | --- | --- |
| Primary | #14151A | Primary background color |
| Secondary | #F9FAFB | Secondary background color |
| Accent | #FBCFE8 | Accent color |

### Secondary & Accent

| Name | Hex | Intent |
| --- | --- | --- |
| Secondary Accent | #E5E7EB | Secondary accent color |
| Background Accent | #282A36 | Background accent color |
| Text Accent | #FFFFFF | Text accent color |

### Surface & Background

| Name | Hex | Intent |
| --- | --- | --- |
| Surface | #14151B | Surface background color |
| Background | #090A11 | Background color |

## 3. Typography Rules

### Font Family

* system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif

### Hierarchy

| Role | Size | Weight | LineHeight | Spacing |
| --- | --- | --- | --- | --- |
| Heading 1 | 72px | 800 | 72px | normal |
| Heading 2 | 60px | 800 | 60px | normal |
| Heading 3 | 53.3333px | 800 | 53.3333px | normal |
| Heading 4 | 53.3333px | 300 | 53.3333px | normal |
| Heading 5 | 48px | 800 | 48px | normal |
| Heading 6 | 48px | 800 | 60px | normal |
| Body Text | 14px | 400 | 20px | normal |

## 4. Component Architecture

### Button

| Property | Value |
| --- | --- |
| Background Color | #090A11 |
| Color | #7F8497 |
| Border | 0px none #7F8497 |
| Border Radius | 40px |
| Padding | 0px 8px |
| Margin | 0px 0px 0px 16px |

### Card

| Property | Value |
| --- | --- |
| Background Color | #282A36 |
| Color | #E5E7EB |
| Border | 1px solid #3B3F4B |
| Border Radius | 8px |
| Padding | 16px 24px |
| Margin | 0px |

### Input

| Property | Value |
| --- | --- |
| Background Color | #00000000 |
| Color | #FFFFFFEB |
| Border | 0px none #FFFFFFEB |
| Border Radius | 6px |
| Padding | 8px 12px |
| Margin | 0px 8px |

## 5. Layout Principles

### Spacing System

| Token | Value | Intent |
| --- | --- | --- |
| Small | 4px | Small spacing |
| Medium | 8px | Medium spacing |
| Large | 16px | Large spacing |
| Extra Large | 24px | Extra large spacing |

### Border Radius

| Token | Value | Intent |
| --- | --- | --- |
| Small | 4px | Small border radius |
| Medium | 8px | Medium border radius |
| Large | 40px | Large border radius |

## 6. Depth & Elevation

### Elevation Levels

| Level | Shadow | Use |
| --- | --- | --- |
| 1 | #505050 -1px -1px 0px 0px | Default elevation |
| 2 | #0000000D 0px 1px 2px 0px | Hover elevation |
| 3 | #CCC6BB 1px 1px 3px 0px inset | Active elevation |
| 4 | #0000001A 0px 10px 15px -3px, #0000000D 0px 4px 6px -2px | Focus elevation |

## 7. Do's and Don'ts

### Do's

1. Use the primary color scheme consistently throughout the application.
2. Use the typography rules to create a clear hierarchy of information.
3. Use whitespace effectively to create a clean and modern aesthetic.
4. Use the component architecture to create consistent and reusable components.
5. Use the layout principles to create a clear and intuitive layout.
6. Use the elevation levels to create a sense of depth and hierarchy.
7. Test the application on different devices and browsers to ensure compatibility.
8. Use accessibility guidelines to ensure the application is accessible to all users.
9. Use the design system to create a consistent and cohesive brand identity.
10. Continuously iterate and improve the design system based on user feedback.

### Don'ts

1. Don't use too many different colors or typography styles.
2. Don't overcrowd the layout with too much information.
3. Don't use inconsistent spacing or padding.
4. Don't use too many different border radii or shadows.
5. Don't neglect to test the application on different devices and browsers.
6. Don't ignore accessibility guidelines.
7. Don't use the design system inconsistently throughout the application.
8. Don't fail to iterate and improve the design system based on user feedback.

## 8. Responsive Behavior

| Breakpoint | Value |
| --- | --- |
| Small | 320px |
| Medium | 768px |
| Large | 1024px |
| Extra Large | 1280px |

## 9. Developer Handover

### Quick Reference

| Name | Hex |
| --- | --- |
| Primary | #14151A |
| Secondary | #F9FAFB |
| Accent | #FBCFE8 |

### AI Prompts

1. Create a button component with a background color of #090A11, color of #7F8497, border radius of 40px, and padding of 0px 8px.
2. Design a card component with a background color of #282A36, color of #E5E7EB, border of 1px solid #3B3F4B, and padding of 16px 24px.
3. Develop an input component with a background color of #00000000, color of #FFFFFFEB, border radius of 6px, and padding of 8px 12px.
4. Create a layout with a small spacing of 4px, medium spacing of 8px, and large spacing of 16px.
5. Design a component with an elevation level of 2, using the shadow #0000000D 0px 1px 2px 0px.