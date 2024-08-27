export async function GET() {
    let result = '';
   
    return new Response(result, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
}