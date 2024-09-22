
import { SusuComponent } from "@/components/susu/susuComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "susu club",
    description: "get a susu box, save & win prizes",
};

export default async function Susu() {
    return (
        <>
            <SusuComponent/>
        </>
    )
}