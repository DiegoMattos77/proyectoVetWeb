import { PropsWithChildren } from "react"

const ErrorMsj = ({children}: PropsWithChildren) => {

  return (
    <div className=" text-center bg-red-600  my-4 text-white font-bold p-3 uppercase">
      {children}
    </div>
  )
}

export default ErrorMsj
