
export function middleware(req: Request) {
    const apiKey = req.headers.get('x-api-key');

    if (apiKey === process.env.SUSU_API_KEY) {
      return new Response(null, { status: 200 });;
    } else {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
}