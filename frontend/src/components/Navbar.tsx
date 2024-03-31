export default function NavBar() {
    return (
        <nav className="w-full rounded-b-md max-w-screen-md bg-slate-50 px-5 py-3 flex shadow-sm mb-4">
            <ul className="w-full h-full flex gap-5 justify-start items-center font-medium text-slate-700 text-lg">
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/about">About</a>
                </li>
            </ul>
            <div className="h-full flex gap-2">
                <button className="w-24 border-2 rounded-md border-blue-500 p-1 text-blue-600 font-medium">LOGIN</button>
                <button className="w-24 rounded-md bg-blue-500 text-slate-50 font-medium">SIGN UP</button>
            </div>
        </nav>
    );
}