import { handleApiError } from '@/backend/errors';
import { searchSampleService } from '@/backend/services/sampleService';
import { searchSampleRequest } from '@/backend/types/request/sample/searchSampleRequest';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());

        const parsed = searchSampleRequest.parse(query);

        const result = await searchSampleService(parsed);

        return Response.json(result);
    } catch (err) {
        return handleApiError(err);
    }
}
