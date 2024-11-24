"use client"

import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

type FileUploaderProps = {
    files: File[] | undefined; //files is an array of File
    onChange: (files: File[]) => void; //function that accepts files
}

const FileUploader = ({ files, onChange } : FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles : File[]) => {
    onChange(acceptedFiles);
  }, []);

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} 
    className="file-upload">
      <input {...getInputProps()} />
        {
            files && files?.length > 0 ? (
                <Image 
                    src={convertFileToUrl(files[0])}
                    height={1000}
                    width={1000}
                    alt="uploaded file"
                    className='max-h-[400px] overflow-hidden object-cover'
                />
            ) : (
                <>
                    <Image
                        src="/assets/icons/upload.svg"
                        height={40}
                        width={40}
                        alt="upload"
                    />
                    <div className='file-upload_label'>
                        <p className='text-14-regular'>
                            <span className='text-green-500'>Click to upload</span> or drag and drop
                        </p>
                        <p>
                            SVG, PNG, JPEG or Gif (max 500x400)
                        </p>
                    </div>
                </>
            )
        }
    </div>
  )
};

export default FileUploader;

