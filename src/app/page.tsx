"use client"

import { useState, useRef, useEffect } from 'react'
import { Menu, X, Paperclip, Send, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchData, getRandomQuestions } from './actions'
import { Story, Data } from './types'

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const contentRef = useRef(null)

  /*   async function getStreamingFactcheckResponse(prompt) {
      const url = `http://143.110.233.189:2222/api/run-pipeline?model=fact_check_fun&prompt=${encodeURIComponent(prompt)}&clientId=1hamsterDog`
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
   
        for await (const chunk of response.body) {
          //setBytes(bytes + chunk.length);
          setOutput((output) => output + new TextDecoder().decode(chunk));
        }
        setIsLoading(false);
   
      } catch (e) {
        if (e instanceof TypeError) {
          console.log(e);
          console.log("TypeError: Browser may not support async iteration");
        } else {
          console.log(`Error in async iterator: ${e}.`);
        }
      }
    }
   */
  const [suggestedQuestions, setSuggestedQuestions] = useState([])

  const refreshQuestions = async () => {
    const questions = await getRandomQuestions(4)
    setSuggestedQuestions(questions)
  }
  useEffect(() => {
    refreshQuestions()
  }, [])



  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [messages])



  const streamResponse = async (prompt: string) => {
    setIsStreaming(true)
    let streamedText = ''
    const response = await fetch(`${process.env.NEXT_PUBLIC_PIPELINE_API_SERVER}/api/run-pipeline?model=fact_check_fun&prompt=${encodeURIComponent(prompt)}&clientId=1hamsterDog`)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')
    const stream = async () => {
      const { done, value } = await reader.read()
      if (done) {
        setIsStreaming(false)
        return
      }
      streamedText += decoder.decode(value)
      //const lines = streamedText.split('\n')
      //const lastLine = lines.pop()
      //streamedText = lastLine
      setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'assistant', content: streamedText }])
      if (!done) {
        await stream()
      }
    }
    await stream()

    setIsStreaming(false)

  }

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: inputValue }])
    setInputValue('')
    setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: '' }])
    await streamResponse(inputValue)
  }

  const handleQuestionClick = (question: string) => {
    setInputValue(question)
  }

  const callServerAction = async () => {
    const data = await fetchData()
    console.log(data.message)
  }

  useEffect(() => {
    callServerAction()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 p-4 xl:px-16 flex justify-between items-center">
        <h1 className="text-xl font-bold">FactCheck ChatBot</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-transparent"
            >
              <Menu className="h-6 w-6 hover:text-yellow-400 transition-colors" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <X className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
                  <span className="sr-only">Close navigation menu</span>
                </Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-300 hover:text-white">Home</a>
              <a href="#" className="text-gray-300 hover:text-white">Chat History</a>
              <a href="#" className="text-gray-300 hover:text-white">Settings</a>
              <a href="#" className="text-gray-300 hover:text-white">Help</a>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="text-gray-300 hover:text-white">Home</a>
          <a href="#" className="text-gray-300 hover:text-white">Chat History</a>
          <a href="#" className="text-gray-300 hover:text-white">Settings</a>
          <a href="#" className="text-gray-300 hover:text-white">Help</a>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 xl:px-32 flex flex-col" ref={contentRef}>
        <div className="flex-1">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="markdown-body"
                    components={{
                      a: ({ node, ...props }) => <a {...props} className="text-blue-400 hover:underline" />,
                      h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold mt-4 mb-2" />,
                      h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold mt-3 mb-2" />,
                      h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-bold mt-2 mb-1" />,
                      ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 mb-2" />,
                      ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 mb-2" />,
                      li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                      blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-gray-500 pl-4 italic my-2" />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code {...props} className="bg-gray-800 rounded px-1" />
                        ) : (
                          <code {...props} className="block bg-gray-800 rounded p-2 my-2 overflow-x-auto" />
                        ),
                      table: ({ node, ...props }) => <table {...props} className="border-collapse border border-gray-600 my-2" />,
                      th: ({ node, ...props }) => <th {...props} className="border border-gray-600 px-2 py-1 bg-gray-800" />,
                      td: ({ node, ...props }) => <td {...props} className="border border-gray-600 px-2 py-1" />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
        </div>
        {messages.length === 0 && (
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Timely Questions</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshQuestions}
                className="flex items-center bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedQuestions.map((item, index) => (
                <Card
                  key={index}
                  className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleQuestionClick(item.question)}
                >
                  <CardContent className="p-4">
                    <Badge className="mb-2" variant="secondary">{item.topic}</Badge>
                    <p className="text-gray-300">{item.question}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Chat input */}
      <div className="bg-gray-800 p-4 xl:px-32 border-t border-gray-700">
        <div className="relative">
          <Textarea
            placeholder="Type your message here..."
            className="flex-1 bg-gray-700 border-gray-600 text-white pr-20 min-h-[44px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:bg-transparent h-8 w-8"
            >
              <Paperclip className="h-4 w-4 hover:text-yellow-400 transition-colors" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:bg-transparent h-8 w-8"
              onClick={handleSendMessage}
              disabled={isStreaming}
            >
              <Send className="h-4 w-4 hover:text-yellow-400 transition-colors" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}