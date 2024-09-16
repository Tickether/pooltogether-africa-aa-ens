import Pooler from "@/model/pooler";
import connectDB from "@/utils/db/mongodb";
import { middleware } from "@/utils/middleware";

export async function POST(
    req: Request,
) {
    const authResponse = middleware(req);
    if (authResponse.status !== 200) {
        return authResponse;
    }
    const { ens } = await req.json()
    try {
        await connectDB()
        const poolerByENS = await Pooler.findOne({ ens: ens })
        return new Response(JSON.stringify(poolerByENS))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}
