import { Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Suspense } from "react"

import updateChoice from "app/choices/mutations/updateChoice"
import Layout from "app/core/layouts/Layout"
import deleteQuestion from "app/questions/mutations/deleteQuestion"
import getQuestion from "app/questions/queries/getQuestion"

export const Question = () => {
  const router = useRouter()
  const questionId = useParam("questionId", "number")
  const [deleteQuestionMutation] = useMutation(deleteQuestion)
  const [question, { refetch }] = useQuery(getQuestion, { id: questionId })
  const [updateChoiceMutation] = useMutation(updateChoice)

  const handleVote = async (id: number) => {
    try {
      await updateChoiceMutation({ id })
      refetch()
    } catch (error) {
      alert(`Error updating choice ${JSON.stringify(error, null, 2)}`)
    }
  }

  return (
    <>
      <Head>
        <title>Question {question.text}</title>
      </Head>

      <div>
        <h1>Question {question.text}</h1>
        <ul>
          {question.choices.map((choice) => (
            <li key={choice.id}>
              {choice.text} - {choice.votes} votes
              <button onClick={() => handleVote(choice.id)}>Vote</button>
            </li>
          ))}
        </ul>
        <Link href={Routes.EditQuestionPage({ questionId: question.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteQuestionMutation({ id: question.id })
              router.push(Routes.QuestionsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowQuestionPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.QuestionsPage()}>
          <a>Questions</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Question />
      </Suspense>
    </div>
  )
}

ShowQuestionPage.authenticate = true
ShowQuestionPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowQuestionPage
