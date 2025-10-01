'use client'

import React from 'react'

interface DateTimeRangePickerProps {
  startDate: Date
  endDate: Date
  onStartChange: (date: Date) => void
  onEndChange: (date: Date) => void
  minDuration?: number // in seconds
  maxDuration?: number // in seconds
}

export function DateTimeRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  minDuration = 3600, // 1 hour default
  maxDuration = 86400, // 24 hours default
}: DateTimeRangePickerProps) {
  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM format
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value)
    onStartChange(newStart)

    // Auto-adjust end date if it's before start + min duration
    const minEnd = new Date(newStart.getTime() + minDuration * 1000)
    if (endDate < minEnd) {
      onEndChange(minEnd)
    }
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value)
    const duration = (newEnd.getTime() - startDate.getTime()) / 1000

    if (duration >= minDuration && duration <= maxDuration) {
      onEndChange(newEnd)
    }
  }

  const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
  const isValidDuration = duration >= minDuration && duration <= maxDuration

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={formatDateTime(startDate)}
            onChange={handleStartChange}
            min={formatDateTime(new Date())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={formatDateTime(endDate)}
            onChange={handleEndChange}
            min={formatDateTime(new Date(startDate.getTime() + minDuration * 1000))}
            max={formatDateTime(new Date(startDate.getTime() + maxDuration * 1000))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Duration: {Math.floor(duration / 3600)}h {Math.floor((duration % 3600) / 60)}m
        {!isValidDuration && (
          <span className="text-red-600 ml-2">
            Duration must be between {minDuration / 3600}h and {maxDuration / 3600}h
          </span>
        )}
      </div>
    </div>
  )
}