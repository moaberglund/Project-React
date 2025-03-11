import BookSearch from "../components/BookSearch"
import Quote from "../components/Quote"

const HomePage = () => {
  return (
    <>


      <div className="flex">

        <div >
          <Quote />
        </div>

        <div >
          <BookSearch />
        </div>

      </div>

    </>
  )
}

export default HomePage