import { SearchQuery } from '~/models/requests/Search.requests'
import databaseService from './database.services'

class SearchService {
  async search({ limit, page, content }: SearchQuery & { limit: number; page: number }) {
    const result = await databaseService.tweets
      .find({ $text: { $search: content } })
      .skip(limit * (page - 1))
      .limit(limit)
    return result
  }
}
const searchService = new SearchService()
export default searchService
