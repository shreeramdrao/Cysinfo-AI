import { ref } from 'vue'
import { baseUrl } from './appConfig.ts'
import { Message } from './database.ts'

export type ChatRequest = {
  model: string
  messages?: Message[]
}

export type ChatMessage = {
  role: string
  content: string
}

export type ChatCompletedResponse = {
  model: string
  created_at: string
  message: ChatMessage
  done: boolean
  total_duration: number
  load_duration: number
  prompt_eval_count: number
  prompt_eval_duration: number
  eval_count: number
  eval_duration: number
}

export type ChatPartResponse = {
  model: string
  created_at: string
  message: ChatMessage
  done: boolean
}

export type ChatResponse = ChatCompletedResponse | ChatPartResponse

export type CreateModelRequest = {
  name: string
  path: string
}

export type CreateModelResponse = {
  status: string
}

export type Model = {
  name: string
  modified_at: string
  size: number
}
export type ListLocalModelsResponse = {
  models: Model[]
}

export type ShowModelInformationRequest = {
  name: string
}

export type ShowModelInformationResponse = {
  license: string
  modelfile: string
  parameters: string
  template: string
}

export type CopyModelRequest = {
  source: string
  destination: string
}

export type CopyModelResponse = {
  status: string
}

export type DeleteModelRequest = {
  model: string
}

export type DeleteModelResponse = {
  status: string
}

export type PullModelRequest = {
  name: string
  insecure?: boolean
}

export type PullModelResponse = {
  status: string
  digest: string
  total: number
}

export type PushModelRequest = {
  name: string
  insecure?: boolean
}

export type PushModelResponse = {
  status: string
}

export type GenerateEmbeddingsRequest = {
  model: string
  prompt: string
  options?: Record<string, any>
}

export type GenerateEmbeddingsResponse = {
  embeddings: number[]
}

// Define a method to get the full API URL for a given path
const getApiUrl = (path: string) =>
  `${baseUrl.value || 'http://localhost:11434/api'}${path}`

const abortController = ref<AbortController>(new AbortController())
const signal = ref<AbortSignal>(abortController.value.signal)
// Define the API client functions
export const useApi = () => {
  const error = ref(null)

  const generateChat = async (
    request: ChatRequest,
    onDataReceived: (data: any) => void,
  ): Promise<any[]> => {
    const timeout = setTimeout(() => abortController.value.abort(), 120000); // 120s timeout

    try {
      const res = await fetch(getApiUrl('/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortController.value.signal,
      })

      if (!res.ok) {
        throw new Error(`Network response error: ${res.status} ${res.statusText}`)
      }

      const reader = res.body?.getReader()
      let results: ChatResponse[] = []
      let buffer = ''

      if (reader) {
        const decoder = new TextDecoder()
        while (true) {
          try {
            const { done, value } = await reader.read()
            if (done) {
              // Process any remaining data in the buffer
              if (buffer.trim()) {
                try {
                  const parsedChunk: ChatPartResponse = JSON.parse(buffer)
                  onDataReceived(parsedChunk)
                  results.push(parsedChunk)
                } catch (e) {
                  console.error('Error processing final chunk:', e)
                }
              }
              break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const parsedChunk: ChatPartResponse = JSON.parse(line)
                  onDataReceived(parsedChunk)
                  results.push(parsedChunk)
                } catch (e) {
                  console.error('Error processing chunk:', e)
                  continue
                }
              }
            }
          } catch (e) {
            console.error('Error reading stream:', e)
            break
          }
        }
      }

      return results
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 120 seconds')
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }
    }

  // Create a model
  const createModel = async (
    request: CreateModelRequest,
  ): Promise<CreateModelResponse> => {
    const response = await fetch(getApiUrl('/create'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  }

  // List local models
  const listLocalModels = async (): Promise<ListLocalModelsResponse> => {
    const response = await fetch(getApiUrl('/tags'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json()
  }

  // Show model information
  const showModelInformation = async (
    request: ShowModelInformationRequest,
  ): Promise<ShowModelInformationResponse> => {
    const response = await fetch(getApiUrl('/show'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  }

  // Copy a model
  const copyModel = async (request: CopyModelRequest): Promise<CopyModelResponse> => {
    const response = await fetch(getApiUrl('/copy'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  }

  // Delete a model
  const deleteModel = async (
    request: DeleteModelRequest,
  ): Promise<DeleteModelResponse> => {
    const response = await fetch(getApiUrl('/delete'), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  }

  // Pull a model
  const pullModel = async (request: PullModelRequest): Promise<PullModelResponse> => {
    const response = await fetch(getApiUrl('/pull'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    return await response.json()
  }

  // Push a model
  const pushModel = async (request: PushModelRequest): Promise<PushModelResponse> => {
    const response = await fetch(getApiUrl('/push'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  }

  // Generate embeddings
  const generateEmbeddings = async (
    request: GenerateEmbeddingsRequest,
  ): Promise<GenerateEmbeddingsResponse> => {
    const response = await fetch(getApiUrl('/embeddings'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    return await response.json()
  }
  const abort = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = new AbortController()
      signal.value = abortController.value.signal
      console.log('Fetch request aborted and controller reset')
    }
  }

  return {
    error,
    generateChat,
    createModel,
    listLocalModels,
    showModelInformation,
    copyModel,
    deleteModel,
    pullModel,
    pushModel,
    generateEmbeddings,
    abort,
  }
}
