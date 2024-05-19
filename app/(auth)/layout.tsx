// file helps us design the authentication page from clerk
// function that always runs when on Authentication package

// function takes the parameter children which is of type reactNode and then returns the centered child
export default function AuthLayout({
    children
}:{
    children: React.ReactNode
}) {
    return(
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    )
}