export default function ColorSwatch({ colors ,collection}) {
    return (
      <div className="flex gap-3 flex-wrap">
        {colors.map((color, index) => {
          if (color.includes(',')) {
            const moreColors = color.split(',');
  
            return (
              <div
                key={index}
                className={` md:h-4  md:w-4 flex justify-center rounded-full border border-black ${collection ? 'h-3 w-3' : 'h-4 w-4'}`}
              >
                {moreColors.map((mc, ind) => {
                  return (
                    <div
                      key={Math.floor(Math.random() * 11) + ind}
                      className="first:rounded-l-full last:rounded-r-full h-full w-1/2  "
                      style={{
                        background: mc,
                      }}
                    />
                  );
                })}
              </div>
            );
          }
          return (
            <div
              key={index}
              className={` md:h-4 md:w-4 rounded-lg border border-black ${collection ? 'h-3 w-3' : 'h-4 w-4'}`}
              style={{ backgroundColor: color }}
            ></div>
          );
        })}
      </div>
    );
  }