import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { templateId, restaurantData } = await request.json()
    
    if (!templateId || !restaurantData) {
      return NextResponse.json(
        { error: 'Missing templateId or restaurantData' },
        { status: 400 }
      )
    }

    // For standalone templates, generate a preview HTML
    const templatePath = path.join(process.cwd(), templateId)
    
    // Check if template exists
    try {
      await fs.access(templatePath)
    } catch {
      return NextResponse.json(
        { error: `Template not found: ${templateId}` },
        { status: 404 }
      )
    }

    // Generate preview HTML with restaurant data
    const previewHTML = generateStandalonePreview(templateId, restaurantData)
    
    return NextResponse.json({
      success: true,
      previewHTML,
      templateId,
      restaurantName: restaurantData.restaurant_info?.name,
      type: 'standalone'
    })

  } catch (error) {
    console.error('Template preview error:', error)
    return NextResponse.json(
      { error: 'Failed to generate template preview' },
      { status: 500 }
    )
  }
}

function generateStandalonePreview(templateId: string, restaurantData: any) {
  const restaurantName = restaurantData.restaurant_info?.name || 'Restaurant'
  const foodType = restaurantData.restaurant_info?.type_of_food || 'Cuisine'
  const address = restaurantData.restaurant_info?.address || 'Location'
  
  // Generate a preview based on template type
  if (templateId === 'foodera-site') {
    return `
      <div class="standalone-preview foodera-preview">
        <div class="preview-header">
          <nav class="preview-nav">
            <div class="logo">
              <img src="/images/logo.png" alt="${restaurantName}" />
            </div>
            <ul class="nav-items">
              <li><a href="#home">Home</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
        
        <div class="preview-hero">
          <div class="hero-content">
            <h1 class="hero-title">${restaurantName}</h1>
            <p class="hero-subtitle">Authentic ${foodType}</p>
            <p class="hero-description">Experience the finest ${foodType} cuisine with fresh ingredients and traditional recipes.</p>
            <button class="hero-cta">View Our Menu</button>
          </div>
          <div class="hero-image">
            <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Delicious food" />
          </div>
        </div>
        
        <div class="preview-features">
          <div class="feature-grid">
            <div class="feature-item">
              <div class="feature-icon">🍽️</div>
              <h3>Fresh Ingredients</h3>
              <p>We use only the freshest ingredients in all our dishes</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👨‍🍳</div>
              <h3>Expert Chefs</h3>
              <p>Our experienced chefs bring authentic flavors to every meal</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🏪</div>
              <h3>Cozy Atmosphere</h3>
              <p>Enjoy your meal in our warm and welcoming environment</p>
            </div>
          </div>
        </div>
        
        <div class="preview-location">
          <h2>Visit Us</h2>
          <p class="location-address">${address}</p>
          <p class="location-hours">Open daily for lunch and dinner</p>
        </div>
      </div>
      
      <style>
        .standalone-preview {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 600px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .preview-header {
          background: rgba(255,255,255,0.95);
          padding: 1rem 2rem;
          backdrop-filter: blur(10px);
        }
        
        .preview-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo img {
          height: 40px;
          width: auto;
        }
        
        .nav-items {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }
        
        .nav-items a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .nav-items a:hover {
          color: #667eea;
        }
        
        .preview-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 4rem 2rem;
          align-items: center;
          color: white;
        }
        
        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }
        
        .hero-description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
          line-height: 1.6;
        }
        
        .hero-cta {
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255,107,107,0.4);
        }
        
        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,107,107,0.6);
        }
        
        .hero-image img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .preview-features {
          background: white;
          padding: 4rem 2rem;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-item {
          text-align: center;
          padding: 2rem;
          border-radius: 12px;
          background: #f8f9fa;
          transition: transform 0.3s ease;
        }
        
        .feature-item:hover {
          transform: translateY(-5px);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .feature-item h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .feature-item p {
          color: #666;
          line-height: 1.6;
        }
        
        .preview-location {
          background: #333;
          color: white;
          padding: 3rem 2rem;
          text-align: center;
        }
        
        .preview-location h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .location-address {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }
        
        .location-hours {
          font-size: 1.1rem;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .preview-hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .feature-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-title {
            font-size: 2rem;
          }
        }
      </style>
    `
  }
  
  // Default preview for unknown templates
  return `
    <div class="standalone-preview default-preview">
      <div class="preview-content">
        <h1>${restaurantName}</h1>
        <p class="subtitle">${foodType} Restaurant</p>
        <p class="description">This is a preview of the ${templateId} template with your restaurant data.</p>
        <div class="info-grid">
          <div class="info-item">
            <strong>Restaurant:</strong> ${restaurantName}
          </div>
          <div class="info-item">
            <strong>Cuisine:</strong> ${foodType}
          </div>
          <div class="info-item">
            <strong>Location:</strong> ${address}
          </div>
        </div>
      </div>
      
      <style>
        .default-preview {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          color: white;
          padding: 3rem;
          border-radius: 12px;
          text-align: center;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .preview-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .preview-content .subtitle {
          font-size: 1.3rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .preview-content .description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }
        
        .info-grid {
          display: grid;
          gap: 1rem;
          text-align: left;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .info-item {
          background: rgba(255,255,255,0.2);
          padding: 1rem;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
      </style>
    `
}