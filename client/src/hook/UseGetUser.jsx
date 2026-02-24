import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

//fetch current user
function UseGetUser() {

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`,
                    { withCredentials: true }
                )
                console.log(result.data);
                dispatch(setUserData(result.data))

            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()

    }, [])
}

export default UseGetUser
