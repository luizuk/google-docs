import React, { useEffect, useState } from 'react'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from 'next/dynamic'
import { useRouter } from 'next/dist/client/router'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { db } from '../firebase';
import { doc, setDoc, where, collection, query, getDocs, onSnapshot } from "firebase/firestore";


const Editor = dynamic(() => import('react-draft-wysiwyg').
  then((module) => module.Editor),
  {
    ssr: false,
  }
)

const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [idDocument, setIdDocument] = useState([])
  const router = useRouter()
  const { id } = router.query

  const getDocumentId = async () => {
    const docsRef = collection(db, "docs");
    const q = query(docsRef, where("slug", "==", id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setIdDocument(doc.id)
    })
  }

  const onEditorStateChange = async (editorState) => {
    setEditorState(editorState)
    await setDoc(doc(db, "docs", idDocument), {
      editorState: convertToRaw(editorState.getCurrentContent())
    }, {
      merge: true
    });
  }

  const getEditorState = async () => {
    const docsRef = collection(db, "docs");
    const q = query(docsRef, where("slug", "==", id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(doc.data().editorState)
        )
      )
    })
  }


  useEffect(() => {
    getDocumentId()
    getEditorState()
  }, [])


  return (
    <div className='bg-[#F8F9FA] min-h-screen pb-16'>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}

        toolbarClasName='flex sticky top-0 z-50 
        !justify-center mx-auto'
        editorClassName='mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border'
      />
    </div>
  )
}

export default TextEditor
