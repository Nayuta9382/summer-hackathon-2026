import { searchSamples } from '../repositories/sampleRepository';
import { SearchSampleParams } from '../types/dbparams/sample/searchSampleParams';
import { SearchSampleRequest } from '../types/request/sample/searchSampleRequest';

// sampleApiで検索処理を行う
export async function searchSampleService(request: SearchSampleRequest) {
    const params: SearchSampleParams = {
        keyword: request.keyword,
        category: request.category,
        limit: request.limit,
        offset: request.offset,
    };

    const results = await searchSamples(params);

    return {
        items: results,
        count: results.length,
    };
}
