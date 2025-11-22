# Guide: How to Add Photos Manually to the Website

## Overview
This guide explains how to add photos to different sections of the Dar Al Achab website.

## Photo Locations

### 1. Create Images Folder
First, create an `images` folder in the `frontend/public` directory:
```
frontend/public/images/
```

### 2. Required Photos

#### Hero Background Image
- **Location**: `frontend/public/images/hero-background.jpg`
- **Purpose**: Main background image for the homepage hero section
- **Recommended Size**: 1920x1080px or larger
- **Format**: JPG, PNG, or WebP

#### Logo Images
- **Location**: `frontend/public/images/logo-without-background.png`
- **Purpose**: Used in header (left and center) and footer
- **Recommended Size**: 200x200px or larger
- **Format**: PNG with transparent background

#### About Section Photos
- **Location**: 
  - `frontend/public/images/entrer1.png`
  - `frontend/public/images/chwaya.png`
  - `frontend/public/images/zitoun.png`
- **Purpose**: Display in the "About" section (right side of "Notre Histoire")
- **Recommended Size**: 800x600px or larger
- **Format**: JPG, PNG, or WebP

#### Menu Section Photos
- **Location**:
  - `frontend/public/images/entrer1.png` (Entrée)
  - `frontend/public/images/chwaya.png` (Tajine / cuisson)
  - `frontend/public/images/menu-fish.png` (Poissons grillés)
  - `frontend/public/images/dessert.png` (Dessert)
- **Purpose**: Display in the Menu Signature section
- **Recommended Size**: 600x400px or larger
- **Format**: JPG, PNG, or WebP

#### Galerie Photos
- **Default**: the site already includes 4 high-quality hosted photos (do not remove them unless you replace them)
- **Location for custom photos**: `frontend/public/images/gallery/`
- **Purpose**: Cards inside the Galerie section
- **Recommended Size**: 800x600px or larger
- **Format**: JPG, PNG, or WebP
- **How to add more**:
  1. Save your photo as `gallery-5.jpg` (or any name) inside `frontend/public/images/gallery/`
  2. Open `frontend/src/App.js`, locate the `galleryImages` array, and add a new entry:
     ```js
     {
       src: '/images/gallery/gallery-5.jpg',
       fallback: 'https://customer-assets.emergentagent.com/job_achab-bistro/artifacts/063lb70q_image.png',
       caption: 'Votre description personnalisée',
     }
     ```
     (Leave the existing remote images in place so they continue to display.)

#### About Feature Image
- **Location**: `frontend/public/images/stand.png`
- **Purpose**: Large rectangular image under the “Notre Histoire” section
- **Recommended Size**: 1200x600px or larger
- **Format**: JPG, PNG, or WebP

#### Menu Overlay Image
- **Location**: `frontend/public/images/menu.png` (fallback to `menu.jpg`)
- **Purpose**: Displayed when visitors click “Voir le Menu”
- **Recommended Size**: 1000px height (portrait)
- **Format**: PNG/JPG

#### Feature Icon (Empty Logo)
- **Location**: `frontend/public/images/empty-logo.png`
- **Purpose**: Replaces emoji icons in the feature cards
- **Recommended Size**: 128x128px
- **Format**: PNG with transparent background

## Step-by-Step Instructions

### Step 1: Prepare Your Photos
1. **Optimize Images**:
   - Use image editing software (Photoshop, GIMP, or online tools like TinyPNG)
   - Compress images to reduce file size (aim for < 500KB per image)
   - Ensure good quality while keeping file size reasonable

2. **Rename Photos**:
   - Use the exact filenames listed above
   - Use lowercase letters and hyphens (no spaces)

### Step 2: Add Photos to the Project
1. **Navigate to the images folder**:
   ```bash
   cd frontend/public
   mkdir -p images  # Create folder if it doesn't exist
   ```

2. **Copy your photos**:
   - Copy all your prepared photos to `frontend/public/images/`
   - Ensure filenames match exactly (case-sensitive)

### Step 3: Verify Photos Are Loaded
1. **Start the development server**:
   ```bash
   cd frontend
   npm start
   ```

2. **Check the website**:
   - Open `http://localhost:3000`
   - Verify all photos are displaying correctly
   - Check browser console for any 404 errors (missing images)

## Photo Specifications by Section

### Hero Background
- **Dimensions**: 1920x1080px (16:9 aspect ratio)
- **File Size**: < 1MB recommended
- **Content**: Restaurant exterior, food display, or ambiance

### Logo
- **Dimensions**: Square format (200x200px minimum)
- **Background**: Transparent (PNG format)
- **Content**: Restaurant logo without background

### About Section Photos
- **Dimensions**: 800x600px (4:3 aspect ratio)
- **File Size**: < 500KB each
- **Content**: 
  - Photo 4: Restaurant interior or ambiance
  - Photo 5: Kitchen or food preparation
  - Photo 6: Dining area or customer experience

### Menu Photos
- **Dimensions**: 600x400px (3:2 aspect ratio)
- **File Size**: < 400KB each
- **Content**:
  - menu-fish.jpg: Grilled fish dish
  - menu-tagine.jpg: Tagine dish

### Galerie Photos
- **Dimensions**: 800x600px (4:3 aspect ratio)
- **File Size**: < 500KB each
- **Content**: mix of dishes, ambiance, staff, etc.

### About Feature Image
- **Dimensions**: 1200x600px
- **File Size**: < 700KB
- **Content**: Wide shot of the kitchen, buffet, or dining room

### Menu Overlay Image
- **Dimensions**: 900px+ height (portrait)
- **File Size**: < 600KB
- **Content**: A clear scan/photo of the printed menu

## Alternative: Using External URLs

If you prefer to host images externally (e.g., on a CDN or image hosting service):

1. **Upload photos to your hosting service** (e.g., Cloudinary, Imgur, AWS S3)
2. **Update image paths in `frontend/src/App.js`**:
   ```javascript
   // Instead of:
   src="/images/hero-background.jpg"
   
   // Use:
   src="https://your-cdn.com/images/hero-background.jpg"
   ```

## Troubleshooting

### Photos Not Displaying
1. **Check file paths**: Ensure filenames match exactly (case-sensitive)
2. **Check file location**: Photos must be in `frontend/public/images/`
3. **Check browser console**: Look for 404 errors
4. **Clear browser cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Photos Loading Slowly
1. **Optimize file sizes**: Compress images before uploading
2. **Use WebP format**: Better compression than JPG/PNG
3. **Consider lazy loading**: Already implemented for gallery images

### Wrong Photo Displaying
1. **Check filename spelling**: Must match exactly
2. **Check file extension**: .jpg vs .jpeg vs .png
3. **Restart development server**: Sometimes needed after adding new files

## Best Practices

1. **Image Optimization**:
   - Always optimize images before uploading
   - Use appropriate formats (JPG for photos, PNG for logos)
   - Keep file sizes reasonable (< 500KB per image)

2. **Consistent Sizing**:
   - Maintain consistent aspect ratios within each section
   - Use similar image dimensions for better visual harmony

3. **Quality**:
   - Use high-quality images (but optimized)
   - Ensure good lighting and composition
   - Avoid blurry or pixelated images

4. **Backup**:
   - Keep original high-resolution versions
   - Store optimized versions in the project

## Quick Reference: File Structure
```
frontend/
  public/
    images/
      hero-background.jpg          (Hero section background)
      logo-without-background.png  (Header and footer logo)
      entrer1.png                  (About + menu photos)
      chwaya.png                   (About + menu photos)
      zitoun.png                   (About section photo)
      menu-fish.png                (Menu section - grilled fish)
      dessert.png                  (Menu section - dessert)
      stand.png                    (Large rectangular image)
      menu-tagine.png              (Optional extra photo)
      menu.png                     (Modal photo of the menu)
      empty-logo.png               (Feature card icon)
      gallery/
        gallery-1.jpg
        gallery-2.jpg
        gallery-3.jpg
        gallery-4.jpg
```

## Need Help?
If you encounter issues:
1. Check the browser console for error messages
2. Verify all file paths are correct
3. Ensure the development server is running
4. Try clearing browser cache and restarting the server

