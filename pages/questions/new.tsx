import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import { FORM_ERROR, QuestionForm } from "app/questions/components/QuestionForm"
import createQuestion from "app/questions/mutations/createQuestion"
import { CreateQuestion } from "app/questions/validations"
import Link from "next/link"
import { useRouter } from "next/router"

const NewQuestionPage = () => {
  const router = useRouter()
  const [createQuestionMutation] = useMutation(createQuestion)

  return (
    <Layout title={"Create New Question"}>
      <h1>Create New Question</h1>

      <QuestionForm
        submitText="Create Question"
        schema={CreateQuestion}
        initialValues={{ text: "", choices: [] }}
        onSubmit={async (values) => {
          try {
            const question = await createQuestionMutation(values)
            router.push(Routes.ShowQuestionPage({ questionId: question.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.QuestionsPage()}>
          <a>Questions</a>
        </Link>
      </p>
    </Layout>
  )
}

NewQuestionPage.authenticate = true

export default NewQuestionPage
