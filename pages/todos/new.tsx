import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createTodo from "app/todos/mutations/createTodo"
import { TodoForm, FORM_ERROR } from "app/todos/components/TodoForm"

const NewTodoPage = () => {
  const router = useRouter()
  const [createTodoMutation] = useMutation(createTodo)

  return (
    <Layout title={"Create New Todo"}>
      <h1>Create New Todo</h1>

      <TodoForm
        submitText="Create Todo"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTodo}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const todo = await createTodoMutation(values)
            router.push(Routes.ShowTodoPage({ todoId: todo.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.TodosPage()}>
          <a>Todos</a>
        </Link>
      </p>
    </Layout>
  )
}

NewTodoPage.authenticate = true

export default NewTodoPage
