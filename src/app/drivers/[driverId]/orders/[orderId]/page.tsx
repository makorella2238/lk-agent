import DetailOrder from "@/components/screen/DetailOrder/DetailOrder";
import Layout from "@/components/layout/Layout";

const OrderDetailPage = () => {
    return (
        <Layout >
            <h1 className="font-bold mt-3 mb-3 text-3xl text-center text-black">
                Личный кабинет агента
            </h1>
            <DetailOrder/>
        </Layout>
    );
}

export default OrderDetailPage