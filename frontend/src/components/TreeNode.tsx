import { useState } from "react";

export default function TreeNode({node, showChildrenNow}: {node: any, showChildrenNow: boolean}) {
    const [showChildren, setShowChildren] = useState(showChildrenNow);
    const hasChildren = node.hasOwnProperty("children");

    const handleClick = () => {
        setShowChildren(!showChildren);
    }

    return (
        <div className="text-slate-700 w-full">
            <button onClick={handleClick} className="w-full px-3 py-2 flex gap-2 rounded-md hover:bg-slate-400">
                {hasChildren ? (
                    showChildren ? (
                        <i className="w-4 fa fa-chevron-down self-center text-xs"></i>
                    ) : (
                        <i className="w-4 fa fa-chevron-right self-center text-xs"></i>
                    )
                ) : (
                    <div className="pl-4"></div>
                )}
                <h1>{node.name}</h1>
            </button>
            {hasChildren && showChildren &&
                <div className="pl-3">
                    {node.children.map((child: any) => {
                        return (
                            <TreeNode node={child} key={child.name} showChildrenNow={false} />
                        )
                    })}
                </div>
            }
        </div>
    )
}
