export async function GET() {
    let result = 
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://www.slumper.me</loc>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>https://www.slumper.me/add</loc>
            <priority>0.8</priority>
        </url>
    </urlset>`;
   
    return new Response(result, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
}