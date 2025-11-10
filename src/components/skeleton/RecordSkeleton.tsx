import React from "react"
import { Skeleton } from "../ui/Skeleton"

export default function RecordSkeleton() {
    return (
        <div className='h-full w-full flex text-white relative overflow-hidden bg-[#1c1c1b]'>
            <div className='h-full flex flex-col flex-1 p-3 sm:p-6 gap-4 sm:gap-6 overflow-auto'>
                {/* Header Skeleton */}
                <div className='flex flex-col gap-2'>
                    <Skeleton className='h-8 sm:h-10 bg-[#2d2d2d] rounded-lg w-64 relative overflow-hidden' />
                    <Skeleton className='h-4 bg-[#2d2d2d] rounded w-50 relative overflow-hidden' />
                </div>

                {/* Stats Cards Skeleton */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-5 min-h-[120px]'>
                            <Skeleton className='h-4 bg-[#2d2d2d] rounded w-24 mb-4 relative overflow-hidden' />
                            <Skeleton className='h-8 bg-[#2d2d2d] rounded w-16 relative overflow-hidden' />
                        </div>
                    ))}
                </div>

                {/* Tip Box Skeleton */}
                <div className='w-full bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-5'>
                    <div className='flex items-start gap-3'>
                        <Skeleton className='w-5 h-5 bg-[#2d2d2d] rounded flex-shrink-0 relative overflow-hidden' />
                        <div className='flex-1'>
                            <Skeleton className='h-5 bg-[#2d2d2d] rounded w-48 mb-2 relative overflow-hidden' />
                            <Skeleton className='h-4 bg-[#2d2d2d] rounded w-full mb-2 relative overflow-hidden' />
                            <Skeleton className='h-4 bg-[#2d2d2d] rounded w-3/4 relative overflow-hidden' />
                        </div>
                    </div>
                    <div className='flex gap-1 mt-3'>
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className='h-1 bg-[#2d2d2d] rounded-full flex-1 relative overflow-hidden' />
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1'>
                    {/* Pie Chart Skeleton */}
                    <div className='md:col-span-2 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                        <Skeleton className='h-6 bg-[#2d2d2d] rounded w-48 mb-2 relative overflow-hidden' />
                        <Skeleton className='h-3 bg-[#2d2d2d] rounded w-32 mb-4 relative overflow-hidden' />
                        <div className='flex items-center justify-center h-[250px]'>
                            <Skeleton className='w-40 h-40 rounded-full bg-[#2d2d2d] relative overflow-hidden' />
                        </div>
                    </div>

                    {/* Engagement Assessment Skeleton */}
                    <div className='bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                        <Skeleton className='h-6 bg-[#2d2d2d] rounded w-40 mb-2 relative overflow-hidden' />
                        <Skeleton className='h-3 bg-[#2d2d2d] rounded w-32 mb-4 relative overflow-hidden' />
                        <div className='space-y-4'>
                            {[...Array(3)].map((_, i) => (
                                <div key={i}>
                                    <div className='flex justify-between mb-2'>
                                        <Skeleton className='h-4 bg-[#2d2d2d] rounded w-20 relative overflow-hidden' />
                                        <Skeleton className='h-4 bg-[#2d2d2d] rounded w-12 relative overflow-hidden' />
                                    </div>
                                    <Skeleton className='w-full bg-[#2d2d2d] rounded-full h-3 relative overflow-hidden' />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Sessions Skeleton */}
                    <div className='lg:col-span-3 bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[300px]'>
                        <Skeleton className='h-6 bg-[#2d2d2d] rounded w-32 mb-4 relative overflow-hidden' />
                        <div className='space-y-2'>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className='p-3 bg-[#2d2d2d] rounded-lg'>
                                    <Skeleton className='h-5 bg-[#1d1d1d] rounded w-48 mb-2 relative overflow-hidden' />
                                    <Skeleton className='h-3 bg-[#1d1d1d] rounded w-64 relative overflow-hidden' />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations Skeleton */}
                    <div className='col-span-full bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl p-4 sm:p-6 min-h-[200px]'>
                        <Skeleton className='h-6 bg-[#2d2d2d] rounded w-40 mb-4 relative overflow-hidden' />
                        <div className='space-y-3'>
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className='p-4 bg-[#2d2d2d] rounded-lg'>
                                    <Skeleton className='h-5 bg-[#1d1d1d] rounded w-48 mb-2 relative overflow-hidden' />
                                    <Skeleton className='h-4 bg-[#1d1d1d] rounded w-full mb-1 relative overflow-hidden' />
                                    <Skeleton className='h-4 bg-[#1d1d1d] rounded w-5/6 relative overflow-hidden' />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}