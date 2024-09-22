import { ClaimComponent } from "@/components/claim/claimComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "susu club",
    description: "get a susu box, save & win prizes",
};

export default async function Claim() {
    return (
        <>
            <ClaimComponent/>
        </>
    )
}