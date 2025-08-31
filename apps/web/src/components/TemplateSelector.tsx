<div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.degree} - {edu.major}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
              专业技能
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {data.skills.map((skill, index) => (
                <div key={skill.id || index} className="flex justify-between">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-sm text-gray-500">{getSkillLevel(skill.level)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
              项目经历
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.period}</span>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && (
                    <p className="text-sm text-gray-500 mt-1">
                      技术栈: {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
