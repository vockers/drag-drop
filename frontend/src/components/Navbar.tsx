export default function NavBar() {
    return (
        <div className="w-full flex justify-center bg-slate-50 shadow-sm mb-5">
            <nav className="w-full max-w-screen-md px-6 py-3 flex justify-between">
                <div className="flex gap-3">
                    <i className="fa fa-layer-group text-slate-500 text-3xl self-center"></i>
                    <span className="text-lg text-slate-600 self-center font-medium">Drag'n Drop</span>
                </div>
                <div className="h-full flex gap-2">
                    <button className="px-3 border-2 rounded-md hover:bg-slate-200 border-blue-500 p-1 text-blue-600 font-medium">LOGIN</button>
                    <button className="px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-slate-50 font-medium text-nowrap">SIGN UP</button>
                </div>
            </nav>
        </div>
    );
}