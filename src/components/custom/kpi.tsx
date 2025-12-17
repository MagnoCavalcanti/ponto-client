import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


const KPI = ({ title, value, action }: { title: string; value: string; action?: React.ReactNode }) => {

    return (
        <Card className="w-64 h-25 py-3 gap-0">
                <CardHeader>
                <CardTitle className="text-sm font-medium text-[#525252]">{title}</CardTitle>
                <CardAction className={cn("bg-[#F5F5F5] p-2 rounded-lg")}>{action}</CardAction>
            </CardHeader>
            <CardContent className="text-3xl font-medium">
                        <p>{value}</p>
            </CardContent>
        </Card>
    )
}

export default KPI;