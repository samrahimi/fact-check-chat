import { getStreamingAnswer } from '@/app/actions'

export default function handler(req, res) {
  getStreamingAnswer(req, res)
}
