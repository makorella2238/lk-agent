import {useQuery} from "@tanstack/react-query";
import {mainService} from "@/services/main.service";
import {IPaymentsAgent} from "@/interfaces/types";

export const useGetPaymentsAgent = () => {
    return useQuery<IPaymentsAgent>({queryKey: ['totalFavoriteCount'], queryFn: mainService.getPaymentsAgent, })
}
//
// onSuccess: (data) => {
//     if (data.userData.username) {
//         setUsername(data.userData.username)
//     }
// }, onError: (err) => {
//     console.log(err)
//     setIsAuthFalse()
//     localStorage.removeItem('token')
// }