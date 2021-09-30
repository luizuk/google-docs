import React, { useEffect, useState } from 'react'
import TextEditor from '../../components/TextEditor'
import Button from "@material-tailwind/react/Button"
import Icon from "@material-tailwind/react/Icon"
import { Router, useRouter } from 'next/dist/client/router'
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from '../../firebase'

const Doc = () => {
  const [document, setDocument] = useState([])
  const router = useRouter();
  const { id } = router.query





  const getDocuments = async () => {
    const docsRef = collection(db, "docs");
    const q = query(docsRef, where("slug", "==", id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setDocument(doc.data())
    })
  }

  if (!document) {
    router.replace('/')
  }
  // console.log('Q', document)

  useEffect(() => {
    getDocuments()
  }, [])

  return (
    <div>
      <header className='flex justify-between items-center p-3 pb-1'>
        <span
          onClick={() => router.push('/')}
          className='cursor-pointer'
        >
          <Icon name='description' size='5xl' color='blue' />
        </span>
        <div className='flex-grow px-2'>
          <h2>{document.fileName}</h2>
          <div className='flex items-center text-sm space-x-1 ml-1 h-8 text-gray-600'>
            <p className='option'>File</p>
            <p className='option'>Edit</p>
            <p className='option'>View</p>
            <p className='option'>Insert</p>
            <p className='option'>Format</p>
            <p className='option'>Tools</p>
          </div>
        </div>

        <Button
          color='lightBlue'
          buttonType='filled'
          size='regular'
          className='hidden md:inline-flex h-10'
          rounded={false}
          block={false}
          iconOnly={false}
          ripple='light'
        >
          <Icon name='people' size='md' /> SHARE
        </Button>


      </header>
      <TextEditor />
    </div>
  )
}

export default Doc
