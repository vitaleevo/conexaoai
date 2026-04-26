export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const cache = caches.default;

		// 1. Handle CORS for all requests
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		// 2. Handle Edge Caching for GET requests (Blog, Category, Tag)
		if (request.method === "GET") {
			const isCacheable = 
				url.pathname.startsWith("/blog") || 
				url.pathname.startsWith("/category") || 
				url.pathname.startsWith("/tag");

			if (isCacheable) {
				// Try to find in cache
				let response = await cache.match(request);
				
				if (!response) {
					console.log(`[Cache Miss] ${url.pathname} - Fetching from origin...`);
					response = await fetch(request);
					
					// Only cache successful responses
					if (response.status === 200) {
						// Create a new response with Cache-Control headers (1 hour = 3600s)
						const newResponse = new Response(response.body, response);
						newResponse.headers.set("Cache-Control", "public, s-maxage=3600");
						
						// Store in cache
						ctx.waitUntil(cache.put(request, newResponse.clone()));
						return newResponse;
					}
				} else {
					console.log(`[Cache Hit] ${url.pathname}`);
					return response;
				}
			}
			
			// Fallback for non-cacheable GETs
			return fetch(request);
		}

		// 3. Handle Newsletter Subscription (POST)
		if (request.method === "POST") {
			try {
				const body: any = await request.json();
				const { email, name, region } = body;

				if (!email) {
					return new Response("Email is required", { status: 400 });
				}

				const country = request.headers.get("cf-ipcountry") || "Unknown";

				await env.DB.prepare(
					"INSERT INTO subscribers (email, name, region, country) VALUES (?, ?, ?, ?)"
				)
				.bind(email, name || null, region || null, country)
				.run();

				return new Response(JSON.stringify({ success: true, message: "Subscription confirmed!" }), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				});
			} catch (error: any) {
				if (error.message.includes("UNIQUE constraint failed")) {
					return new Response(JSON.stringify({ success: true, message: "You are already subscribed!" }), {
						status: 200,
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						},
					});
				}
				return new Response(JSON.stringify({ success: false, message: error.message }), {
					status: 500,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				});
			}
		}

		return new Response("Method not allowed", { status: 405 });
	},
};
