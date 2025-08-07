# Restaurant Website Templates

## 📁 Organized Structure

```
templates/
├── config/                          # Shared configuration files
│   ├── next.config.js              # Next.js build configuration
│   ├── postcss.config.js           # PostCSS/Tailwind configuration  
│   ├── tsconfig.json               # TypeScript configuration
│   └── package.template.json       # Package.json template
├── modern-restaurant/               # Template-specific files only
│   ├── template.json               # Template metadata & colors
│   ├── tailwind.config.js          # Custom colors & design system
│   └── app/                        # React components
│       ├── layout.tsx              # Page layout
│       ├── page.tsx                # Main website content
│       └── globals.css             # Custom styles
└── README.md                       # This file
```

## 🎯 What Goes Where

### `/config/` - Shared Files
- **next.config.js**: Static export configuration (same for all templates)
- **postcss.config.js**: Tailwind CSS setup (same for all templates)  
- **tsconfig.json**: TypeScript configuration (same for all templates)
- **package.template.json**: Package.json template with placeholders

### `/[template-name]/` - Template-Specific Files
- **template.json**: Template metadata, colors, features
- **tailwind.config.js**: Template-specific colors and design system
- **app/**: React components and styles unique to this template

## 🛠️ How It Works

When generating a website:

1. **Template files** are copied from `/[template-name]/`
2. **Config files** are copied from `/config/`
3. **package.json** is generated from `/config/package.template.json`
4. **Placeholders** are replaced with restaurant data

## 🎨 Creating New Templates

### Step 1: Create Template Directory
```bash
mkdir templates/my-new-template
```

### Step 2: Copy Essential Files
```bash
# Copy from existing template
cp templates/modern-restaurant/template.json templates/my-new-template/
cp templates/modern-restaurant/tailwind.config.js templates/my-new-template/
cp -r templates/modern-restaurant/app/ templates/my-new-template/
```

### Step 3: Customize
- Edit `template.json` for metadata and colors
- Edit `tailwind.config.js` for design system
- Edit `app/` files for layout and styling

### Step 4: Test
```bash
cd generator/
node website-builder.js --template my-new-template --restaurant sanabel_al_salam_102737.json
```

## ✅ Benefits of This Structure

- **No Duplication**: Config files shared across all templates
- **Easy Maintenance**: Update Next.js version in one place
- **Clean Templates**: Only template-specific files in each directory
- **Consistent**: All templates use same build system
- **Scalable**: Easy to add new templates

## 🔧 Template-Specific Customization

### Colors & Design (`tailwind.config.js`)
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-secondary'
    }
  }
}
```

### Metadata (`template.json`)
```json
{
  "name": "my-template",
  "display_name": "My Template",
  "color_scheme": {
    "primary": "#color"
  }
}
```

### Layout & Content (`app/`)
- `layout.tsx`: Page structure, metadata, fonts
- `page.tsx`: Main website content and components  
- `globals.css`: Custom styles and animations