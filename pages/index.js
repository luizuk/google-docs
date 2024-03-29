import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Button from "@material-tailwind/react/Button"
import Icon from "@material-tailwind/react/Icon"
import Image from 'next/image'
import { getSession, useSession } from 'next-auth/client'
import Login from '../components/Login'
import Modal from '@material-tailwind/react/Modal'
import ModalBody from '@material-tailwind/react/ModalBody'
import ModalFooter from '@material-tailwind/react/ModalFooter'
import { db } from '../firebase'
import { doc, setDoc, Timestamp, addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import DocumentRow from '../components/DocumentRow'
import slug from '../utils/slug'


export default function Home() {
  // const [session] = useSession()
  const [showModal, setShowModal] = useState(false)
  const [input, setInput] = useState('')
  const [list, setList] = useState([])
  const [idsList, setIdsList] = useState([])


  const getDocuments = () => {
    const q = query(collection(db, "docs"), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
        setList(documents)
      })
    })
  }

  console.log(idsList)

  useEffect(() => {
    getDocuments()
  }, [])

  const createDocument = async () => {
    if (!input) return

    await addDoc(collection(db, "docs"), {
      fileName: input,
      slug: slug(input),
      timestamp: Timestamp.fromDate(new Date()),

    })

    setInput('')
    setShowModal(false)
  }


  // if (!session) return <Login />

  const modal = (
    <Modal
      size='sm'
      active={showModal}
      toggler={() => setShowModal(false)}
    >

      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type='text'
          className='outline-none w-full'
          placeholder='Enter name of document...'
          onKeyDown={(e) => e.key === 'Enter' && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color='blue'
          buttonType='link'
          onClick={(e) => setShowModal(false)}
          ripple='dark'
        >
          Cancel
        </Button>
        <Button color='blue' onClick={createDocument} ripple='light'>
          Create
        </Button>
      </ModalFooter>

    </Modal>
  )



  return (
    <div>
      <Head>
        <title>Google Docs Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {modal}

      <section className='bg-[#F8F9FA] pb-10 px-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex items-center justify-between py-6'>
            <h2 className='text-gray-700 text-lg'>Start a New document</h2>
            <Button
              color='gray'
              buttonType='outline'
              rounded={true}
              iconOnly={true}
              ripple='dark'
              className='border-0'
            >
              <Icon name='more_vert' size='3xl' color='gray' />
            </Button>
          </div>
          <div>
            <div onClick={() => setShowModal(true)} className='relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700'>
              <Image
                src='https://links.papareact.com/pju'
                layout='fill'
              />
            </div>
            <p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>Blank</p>
          </div>
        </div>
      </section>

      <section className='bg-white px-10 md:px-0'>
        <div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
          <div className='flex items-center justify-between pb-5'>
            <h2 className='font-medium flex-grow'>My Documents</h2>
            <p className='mr-12'>Date Created</p>
            <Icon name='folder' size='3xl' color='gray' />
          </div>

          {list.map((doc, i) =>
            <DocumentRow
              key={i}
              id={doc.slug}
              fileName={doc.fileName}
              date={doc.timestamp}
            />
          )}
        </div>

      </section>

    </div>
  )
}


// export async function getServerSideProps(context) {
//   const session = await getSession(context)

//   return {
//     propps: {
//       session,
//     }
//   }
// }