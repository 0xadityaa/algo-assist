interface LoadingProps {
  text?: string;
}

const Loading = ({ text = "Loading..." }: LoadingProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2 p-4 bg-slate-800 rounded-lg text-slate-100">
          <span className="font-mono">$</span>
          <span className="font-mono">{text}</span>
          <span className="animate-pulse">...</span>
          <span className="w-2 h-5 bg-slate-100 animate-[blink_1s_infinite]" />
        </div>
        <style jsx>{`
          @keyframes blink {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loading;