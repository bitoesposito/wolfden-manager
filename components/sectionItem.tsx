import { Button } from "./ui/button"
import { ListX, Plus } from "lucide-react"
import UserCard from "./userCard"
import { Separator } from "./ui/separator"

export default function SectionItem() {
    return (
        <section className="grid gap-2 items-center" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))' }}>
            <div className="col-span-full flex items-center justify-between">
                <h2 className="font-bold uppercase">Section name</h2>
                <Button variant="outline"><ListX className="w-fit" /></Button>
            </div>
            <UserCard />
            <UserCard />
            <UserCard />
            <Button variant="outline" className="w-full h-full"><Plus />Nuova postazione</Button>

            <Separator className="col-span-full"/>
            <Button variant="outline" className="w-full col-span-full"><Plus />Nuova sezione</Button>
        </section>
    )
}