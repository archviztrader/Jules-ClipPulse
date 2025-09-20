import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString()
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getEngineDisplayName(engine: string): string {
  const engines: Record<string, string> = {
    stepfun: 'StepFun',
    qwen: 'Qwen',
    pika: 'Pika',
    invideo: 'InVideo',
    chatglm: 'ChatGLM',
    vheer: 'Vheer'
  }
  return engines[engine] || engine
}