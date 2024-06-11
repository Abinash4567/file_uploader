'use client';

import Image from 'next/image'
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface File {
    path: string;
    name: string;
    lastModified: number;
    lastModifiedDate: Date;
    webkitRelativePath: string;
    size: number;
    type: string;
}

interface selFile {
    name: string;
    preview: string;
}


const Dropzone = ({ className }: { className?: string }) => {
    const [files, setFiles] = useState<selFile[]>([])
    const [rejected, setRejected] = useState<File[]>([])

    
    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
        console.log(acceptedFiles);
        if (acceptedFiles?.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFiles.map((file: File) => ({
                    ...file,
                    preview: URL.createObjectURL(file),
                        name: file.name,
                })),
            ]);
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: 1024 * 1000,
        onDrop
    })

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () =>
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [files])

    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.name !== name))
    }

    const removeAll = () => {
        setFiles([])
        setRejected([])
    }

    const removeRejected = (name: string) => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    // const handleSubmit = async e => {
    //     e.preventDefault()

    //     if (!files?.length) return

    //     const formData = new FormData()
    //     files.forEach(file => formData.append('file', file))
    //     formData.append('upload_preset', 'friendsbook')
    //     console.log(formData)
    // }

    return (

        <form>
            <div
                {...getRootProps({
                    className: className
                })}
            >
                <input {...getInputProps()} />
                <div className='flex flex-col items-center justify-center gap-4'>
                    <ArrowUpTrayIcon className='w-5 h-5 fill-current' />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag & drop files here, or click to select files</p>
                    )}
                </div>
            </div>



            {/* Preview */}
            <section className='mt-10'>
                <div className='flex gap-4'>
                    <h2 className='title text-3xl font-semibold'>Preview</h2>
                    <button
                        type='button'
                        onClick={removeAll}
                        className='mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors'
                    >
                        Remove all files
                    </button>
                    {/* <button
                        type='submit'
                        className='ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors'
                    >
                        Upload to Cloudinary
                    </button> */}
                </div>

                {/* Accepted files */}
                <h3 className='title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3'>
                    Accepted Files
                </h3>
                <ul className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10'>
                    {files.map(file => (
                        <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
                            <Image
                                src={file.preview}
                                alt={file.name}
                                width={100}
                                height={100}
                                onLoad={() => {
                                    URL.revokeObjectURL(file.preview)
                                }}
                                className='h-full w-full object-contain rounded-md'
                            />
                            <button
                                type='button'
                                className='w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors'
                                onClick={() => removeFile(file.name)}
                            >
                                <XMarkIcon className='w-5 h-5 fill-white hover:fill-secondary-400 transition-colors' />
                            </button>
                            <p className='mt-2 text-neutral-500 text-[12px] font-medium'>
                                {file.name}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Rejected Files */}
                <h3 className='title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3'>
                    Rejected Files
                </h3>
                <ul className='mt-6 flex flex-col'>
                    {rejected.map(({ file, errors }) => (
                        <li key={file.name} className='flex items-start justify-between'>
                            <div>
                                <p className='mt-2 text-neutral-500 text-sm font-medium'>
                                    {file.name}
                                </p>
                                <ul className='text-[12px] text-red-400'>
                                    {errors.map((error: { code: Key | null | undefined; message: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                                        <li key={error.code}>{error.message}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                type='button'
                                className='mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors'
                                onClick={() => removeRejected(file.name)}
                            >
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </form>
    )
}

export default Dropzone;